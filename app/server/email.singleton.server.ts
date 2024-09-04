import Mail from "nodemailer/lib/mailer";
import { CommentModel, PostModel } from "./db.singleton.server";
import nodemailer from "nodemailer";
import SendmailTransport from "nodemailer/lib/sendmail-transport";

function getEmailBodyData(
  comment: CommentModel,
  post: PostModel,
  origin: string
): { html: string; text: string } {
  return {
    html: `<p>A comment document was inserted:</p></br /><ul><li>date: ${comment.date}</li><li>post: ${post.meta.title}</li><li>comment: ${comment.content}</li><li>user: ${comment.user}</li>
    </ul><br /><a href="${origin}#comments">View the comment</a>`,
    text: `A comment document was inserted:

date: ${comment.date}
post: ${post.meta.title}
comment: ${comment.content}
user: ${comment.user}

See the comment here: ${origin}#comments`,
  };
}

class Email {
  from: string;
  to: string;
  transporter: nodemailer.Transporter<SendmailTransport.SentMessageInfo>;

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

  public sendCommentNotification(
    comment: CommentModel,
    post: PostModel,
    origin: string
  ) {
    const emailBodyData = getEmailBodyData(comment, post, origin);

    const opts: Mail.Options = {
      from: this.from,
      to: this.to,
      subject: "PORTFOLIO: Comment document inserted",
      text: emailBodyData.text,
      html: emailBodyData.html,
    };

    this.transporter.sendMail(opts, (err, info) => {
      if (err) console.error("Error sending email", err);
      else {
        console.log(
          `📬 Mail sent!
  accepted: ${info.accepted.join(", ")}
  rejected: ${info.rejected.join(", ")}
  pending: ${info.pending.join(", ")}`
        );
      }
    });
  }
}
const singleton = Object.freeze(new Email());
export default singleton;
