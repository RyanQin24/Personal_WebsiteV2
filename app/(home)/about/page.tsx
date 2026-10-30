import ExperienceList from "@/components/experiences/ExperienceList";
import styles from "@/components/experiences/Experiences.module.css";
import { BASE_URL, META_DESCRIPTION_EXPERIENCES, PATH_ABOUT } from "@/lib/constants";
import { getOGData } from "@/lib/utils";
import { Metadata } from "next/types";
import { experiences } from "./content";

export const metadata: Metadata = {
  title: "Experiences",
  description: META_DESCRIPTION_EXPERIENCES,
  alternates: { canonical: PATH_ABOUT },
  openGraph: getOGData({
    title: "Experiences",
    description: META_DESCRIPTION_EXPERIENCES,
    url: `${BASE_URL}${PATH_ABOUT}`,
  }),
};

export default function ExperiencesPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Work Experience</h1>
      <ExperienceList experiences={experiences} />
    </div>
  );
}
