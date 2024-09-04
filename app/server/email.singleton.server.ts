import aws from "@aws-sdk/client-ses";
import { CommentModel, PostModel } from "./db.singleton.server";

function getEmailBodyData(
  comment: CommentModel,
  post: PostModel
): { html: string; text: string } {
  return {
    html: `<p>A comment document was inserted:</p></br /><ul><li>date: ${comment.date}</li><li>post: ${post.meta.title}</li><li>user: ${comment.user}</li>
    </ul><br /><a href="https://blakenetzeband.com/blog/${post.meta.slug}#comments">View the comment</a>`,
    text: `A comment document was inserted:

date: ${comment.date}
post: ${post.meta.title}
user: ${comment.user}

See the comment here: https://blakenetzeband.com/blog/${post.meta.slug}#comments`,
  };
}

class Email {
  ses: aws.SES;
  emailAddress: string;

  constructor() {
    this.emailAddress = "blake.netzeband@gmail.com";
    this.ses = new aws.SES({ apiVersion: "2010-12-01", region: "us-east-2" });
  }

  public sendCommentNotification(comment: CommentModel, post: PostModel) {
    const emailBodyData = getEmailBodyData(comment, post);

    this.ses
      .sendEmail({
        Destination: {
          ToAddresses: [this.emailAddress],
        },
        Message: {
          Body: {
            Html: { Charset: "UTF-8", Data: emailBodyData.html },
            Text: { Charset: "UTF-8", Data: emailBodyData.text },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "PORTFOLIO: Comment document inserted",
          },
        },
        Source: this.emailAddress,
        ReplyToAddresses: [this.emailAddress],
      })
      .catch((e) => {
        console.error("Error sending email", e);
      });
  }
}
const singleton = Object.freeze(new Email());
export default singleton;
