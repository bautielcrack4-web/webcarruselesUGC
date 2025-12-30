import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Button,
} from '@react-email/components';

const main = {
    backgroundColor: '#000000',
    fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
    color: '#ffffff',
};

const container = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#111111',
    borderRadius: '12px',
    padding: '40px 20px',
    border: '1px solid #333',
};

const h1 = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '0 0 20px',
};

const text = {
    color: '#e0e0e0',
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'center' as const,
    marginBottom: '30px',
};

const button = {
    backgroundColor: '#ffffff',
    borderRadius: '50px',
    color: '#000000',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding: '14px 40px',
    textAlign: 'center' as const,
    display: 'block',
    width: '240px',
    margin: '0 auto',
};

const footer = {
    color: '#666666',
    fontSize: '12px',
    textAlign: 'center' as const,
    marginTop: '40px',
};

export const WelcomeEmail = () => (
    <Html>
        <Head />
        <Preview>Welcome to Adfork - Create your first AI Video</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Welcome to Adfork 🚀</Heading>
                <Text style={text}>
                    We are thrilled to have you on board! Adfork gives you the power to create professional UGC ads in seconds using AI.
                </Text>
                <Text style={text}>
                    Ready to make your first viral video?
                </Text>

                <Button style={button} href="https://adfork.app/dashboard/studio">
                    Create Video
                </Button>

                <Text style={footer}>
                    © 2025 Adfork.<br />
                    Need help? Reply to this email.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default WelcomeEmail;
