import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ConfirmationEmailProps {
  confirmationUrl: string;
}

const LOGO_URL = "https://yotxgvtqhjonujoiebno.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1";

export const ConfirmationEmail = ({ confirmationUrl }: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Complete Your SokoniArena Signup</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src={LOGO_URL}
            alt="SokoniArena Logo"
            width="80"
            height="80"
            style={logo}
          />
          <Text style={brandName}>SokoniArena</Text>
          <Text style={tagline}>Welcome to our community</Text>
        </Section>

        <Section style={content}>
          <Text style={title}>Complete Your Signup</Text>

          <Text style={paragraph}>Hello,</Text>

          <Text style={paragraph}>
            You&apos;re almost done setting up your SokoniArena profile. Please click below to finish:
          </Text>

          <Section style={buttonContainer}>
            <Link href={confirmationUrl} style={actionButton}>
              Complete Signup
            </Link>
          </Section>

          <Text style={paragraph}>
            If the link doesn&apos;t work, copy and paste this into your browser:
          </Text>

          <Section style={linkBox}>
            <Text style={linkText}>{confirmationUrl}</Text>
          </Section>

          <Hr style={divider} />

          <Section style={notice}>
            <Text style={noticeText}>
              Questions? Contact our team for assistance.
            </Text>
          </Section>

          <Text style={paragraph}>
            If you didn&apos;t request this, you can disregard this message.
          </Text>

          <Text style={paragraph}>Sincerely,</Text>
          <Text style={paragraph}>SokoniArena</Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>© 2026 SokoniArena</Text>
          <Section style={footerLinks}>
            <Link href="https://sokoniarena.co.ke" style={footerLink}>
              Visit Site
            </Link>
            <Link href="https://sokoniarena.co.ke/terms" style={footerLink}>
              Terms
            </Link>
          </Section>
          <Text style={footerText}>Nairobi</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ConfirmationEmail;

const main = {
  backgroundColor: "#f7f9f7",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "white",
  borderRadius: "8px",
  overflow: "hidden" as const,
};

const header = {
  backgroundColor: "#0a7e3a",
  color: "white",
  padding: "25px 20px",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto 10px auto",
  display: "block",
  borderRadius: "8px",
};

const brandName = {
  fontSize: "18px",
  margin: "5px 0",
  color: "white",
};

const tagline = {
  fontSize: "14px",
  opacity: 0.9,
  margin: "0",
  color: "white",
};

const content = {
  padding: "30px",
};

const title = {
  color: "#1a3c2a",
  fontSize: "20px",
  marginTop: "0",
  marginBottom: "20px",
};

const paragraph = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "25px 0",
};

const actionButton = {
  display: "inline-block",
  backgroundColor: "#0da34d",
  color: "white",
  textDecoration: "none",
  padding: "12px 24px",
  borderRadius: "6px",
  fontWeight: "bold",
};

const linkBox = {
  backgroundColor: "#f5f5f5",
  padding: "12px",
  borderRadius: "4px",
  margin: "15px 0",
};

const linkText = {
  fontFamily: "monospace",
  fontSize: "13px",
  wordBreak: "break-all" as const,
  margin: "0",
  color: "#333",
};

const divider = {
  borderColor: "#eee",
  margin: "25px 0",
};

const notice = {
  backgroundColor: "#f0f8f3",
  padding: "15px",
  borderRadius: "6px",
  margin: "20px 0",
};

const noticeText = {
  fontSize: "14px",
  margin: "0",
  color: "#333",
};

const footer = {
  backgroundColor: "#f8fbf9",
  padding: "20px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#666",
  fontSize: "14px",
  margin: "5px 0",
};

const footerLinks = {
  margin: "10px 0",
};

const footerLink = {
  color: "#0a7e3a",
  margin: "0 10px",
  textDecoration: "none",
};
