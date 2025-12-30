import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Button,
    Hr,
} from '@react-email/components';

interface OrderReceiptEmailProps {
    customerName?: string;
    orderId: string;
    planName: string;
    amount: string;
    creditsAdded: number;
    date: string;
}

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

const logo = {
    margin: '0 auto',
    marginBottom: '30px',
};

const h1 = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '0 0 20px',
};

const text = {
    color: '#e0e0e0',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'center' as const,
};

const details = {
    backgroundColor: '#222',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
    textAlign: 'left' as const,
};

const detailRow = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    color: '#aaa',
    fontSize: '14px',
};

const detailValue = {
    color: '#fff',
    fontWeight: 'bold',
};

const button = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    color: '#000000',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding: '12px 30px',
    textAlign: 'center' as const,
    display: 'block',
    width: '200px',
    margin: '30px auto',
};

const footer = {
    color: '#666666',
    fontSize: '12px',
    textAlign: 'center' as const,
    marginTop: '30px',
};

export const OrderReceiptEmail = ({
    customerName = "Creator",
    orderId = "12345",
    planName = "Pro Plan",
    amount = "$49.00",
    creditsAdded = 150,
    date = "Dec 30, 2025"
}: OrderReceiptEmailProps) => (
    <Html>
        <Head />
        <Preview>Receipt for your Adfork purchase</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Payment Successful</Heading>
                <Text style={text}>
                    Hi {customerName}, thanks for your purchase! Your account has been credited.
                </Text>

                <Section style={details}>
                    <div style={detailRow}>
                        <span>Order ID</span>
                        <span style={detailValue}>{orderId}</span>
                    </div>
                    <div style={detailRow}>
                        <span>Plan/Pack</span>
                        <span style={detailValue}>{planName}</span>
                    </div>
                    <div style={detailRow}>
                        <span>Date</span>
                        <span style={detailValue}>{date}</span>
                    </div>
                    <div style={detailRow}>
                        <span>Amount</span>
                        <span style={detailValue}>{amount} USD</span>
                    </div>
                    <Hr style={{ borderColor: '#444', margin: '15px 0' }} />
                    <div style={{ ...detailRow, fontSize: '16px', color: '#fff' }}>
                        <span>Credits Added</span>
                        <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>+{creditsAdded} Credits</span>
                    </div>
                </Section>

                <Button style={button} href="https://adfork.app/dashboard">
                    Go to Studio
                </Button>

                <Text style={footer}>
                    © 2025 Adfork. All rights reserved.<br />
                    If you have questions, reply to this email.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default OrderReceiptEmail;
