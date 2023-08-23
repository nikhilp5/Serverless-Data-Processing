package A1;
import java.io.File;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.BucketWebsiteConfiguration;
import com.amazonaws.services.s3.model.PublicAccessBlockConfiguration;
import com.amazonaws.services.s3.model.SetPublicAccessBlockRequest;

public class Main {
	public static void main(String[] args) {
		try {
			//Creating session with required tokens
			//(Took reference from https://github.com/aws/aws-sdk-java)
			BasicSessionCredentials credentials = new BasicSessionCredentials(
					"awsAccessKey",
					"awsSecretKey",
					"sessionToken");

			//Accessing S3 through SDK
			//(Took reference from https://github.com/aws/aws-sdk-java)
			AmazonS3 s3 = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion(Regions.US_EAST_1).build();

			//Creating S3 bucket
			s3.createBucket("a1-part-b");

			//Setting S3 bucket access to public
			//Reference - https://github.com/awsdocs/amazon-s3-developer-guide/blob/master/doc_source/access-control-block-public-access.md
			s3.setPublicAccessBlock(new SetPublicAccessBlockRequest()
					.withBucketName("a1-part-b")
					.withPublicAccessBlockConfiguration(new PublicAccessBlockConfiguration()
							.withBlockPublicAcls(false)
							.withIgnorePublicAcls(false)
							.withBlockPublicPolicy(false)
							.withRestrictPublicBuckets(false)));

			//Putting index.html file in S3 bucket
			s3.putObject("a1-part-b", "index.html", new File("index.html"));

			//Setting and configuring S3 bucket policy for static hosting
			//Reference -https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/examples-s3-website-configuration.html
			s3.setBucketWebsiteConfiguration("a1-part-b",new BucketWebsiteConfiguration("index.html"));
			//Reference -https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html
			s3.setBucketPolicy("a1-part-b", "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadGetObject\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":[\"s3:GetObject\"],\"Resource\":[\"arn:aws:s3:::a1-part-b/*\"]}]}");
		}
		catch(Exception e) {
			e.printStackTrace();
			System.exit(0);
		}
	}
}
