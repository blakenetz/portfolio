import Mail from "nodemailer/lib/mailer";
import { CommentModel, PostModel } from "./db.singleton.server";
import nodemailer from "nodemailer";

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
  from: string;
  to: string;
  transporter: nodemailer.Transporter;

  constructor() {
    this.from = "blakenetzeband.portfolio@gmail.com";
    this.to = "blake.netzeband@gmail.com";
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: this.from,
        pass: process.env.GOOGLE_EMAIL_PASSWORD,
      },
    });
  }

  public sendCommentNotification(comment: CommentModel, post: PostModel) {
    const emailBodyData = getEmailBodyData(comment, post);

    const opts: Mail.Options = {
      from: this.from,
      to: this.to,
      subject: "PORTFOLIO: Comment document inserted",
      text: emailBodyData.text,
      html: emailBodyData.html,
    };

    this.transporter.sendMail(opts, (err, _info) => {
      if (err) console.error("Error sending email", err);
    });
  }
}
const singleton = Object.freeze(new Email());
export default singleton;
