import Sheet from "@/components/Sheet";
import { CopyButton, TsujidoTime } from "./Live";

const EMAIL = "rintaro060825@gmail.com";

export default function Contact() {
  return (
    <Sheet title="Contact" className="postcard">
      {/* The stamp is a window cut through the card (see .postcard-face):
          what shows in it is the sky itself, with the hour it is there. */}
      <p className="postcard-stamp sky-text">
        <span className="sr-only">Time in Tsujido: </span>
        <span lang="ja" aria-hidden>
          辻堂
        </span>
        <TsujidoTime />
      </p>
      <div className="postcard-face">
        <p className="postcard-message statement">
          Write to me about photographs, retouching or a logo. Mail or
          Instagram, whichever is easier.
        </p>
        <dl className="postcard-address">
          <div>
            <dt>Mail</dt>
            <dd>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <CopyButton text={EMAIL} />
            </dd>
          </div>
          <div>
            <dt>Instagram</dt>
            <dd>
              <a
                href="https://instagram.com/med_dropsss"
                target="_blank"
                rel="noopener noreferrer"
              >
                @med_dropsss
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </Sheet>
  );
}
