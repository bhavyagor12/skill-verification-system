import { SocialIcon } from "react-social-icons";

const SocialIconRenderer = ({ url, type }: { url: string; type: string }) => {
  //check if url valid
  if (!url) return null;
  let validUrl = url.startsWith("http") || url.startsWith("https") ? true : false;
  validUrl = validUrl && url.includes(type);
  if (!validUrl) return null;
  return (
    <SocialIcon
      url={url}
      style={{
        width: 30,
        height: 30,
      }}
    />
  );
};

export { SocialIconRenderer };
