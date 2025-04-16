import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  heading: { fontSize: 20, marginBottom: 10 },
  text: { fontSize: 12 },
});

// Create Document Component
const Invoice = ({ booking, vehicle }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Invoice</Text>
        <Text style={styles.text}>Booking ID: {booking.id}</Text>
        <Text style={styles.text}>Vehicle: {vehicle.model}</Text>
        <Text style={styles.text}>Start Date: {booking.startDate}</Text>
        <Text style={styles.text}>End Date: {booking.endDate}</Text>
        {/* Add more details as needed */}
      </View>
    </Page>
  </Document>
);

export default Invoice;
