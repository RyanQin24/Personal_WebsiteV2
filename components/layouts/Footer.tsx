import { MY_EMAIL_ADDRESS, URL_MY_EMAIL, URL_MY_GITHUB, URL_MY_LINKEDIN } from "@/lib/constants";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import NavButton from "../common/links/NavButton";
import EmailContact from "./EmailContact";

export default function Footer() {
  return (
    <footer className="flex flex-col w-full mt-12">
      <hr />
      <section className="flex justify-center sm:justify-start w-full my-10">
        <nav className="flex gap-1 -ml-2" aria-label="Contact links">
          <NavButton href={URL_MY_GITHUB} external>
            <GitHubLogoIcon aria-hidden="true" />
            <span className="sr-only">GitHub</span>
          </NavButton>
          <NavButton href={URL_MY_LINKEDIN} external>
            <LinkedInLogoIcon aria-hidden="true" />
            <span className="sr-only">LinkedIn</span>
          </NavButton>
          <EmailContact address={MY_EMAIL_ADDRESS} mailto={URL_MY_EMAIL} />
        </nav>
      </section>
    </footer>
  );
}
