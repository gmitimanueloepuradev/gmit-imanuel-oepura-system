import Head from "next/head";

export default function PageTitle({ title, description }) {
  const baseTitle = "GMIT Imanuel Oepura";
  const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta content={description} name="description" />}
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link href="/favicon.ico" rel="icon" />
    </Head>
  );
}
