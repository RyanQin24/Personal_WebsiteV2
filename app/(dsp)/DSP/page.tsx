import DspLab from "@/components/audio/DspLab";
import {
  BASE_URL,
  META_DESCRIPTION_DSP,
  PATH_DSP,
} from "@/lib/constants";
import { getOGData } from "@/lib/utils";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "DSP! — Stereo Signal Lab",
  description: META_DESCRIPTION_DSP,
  alternates: { canonical: PATH_DSP },
  openGraph: getOGData({
    title: "DSP! — Stereo Signal Lab",
    description: META_DESCRIPTION_DSP,
    url: `${BASE_URL}${PATH_DSP}`,
  }),
};

export default function DspPage() {
  return <DspLab />;
}
