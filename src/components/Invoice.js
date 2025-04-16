import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  heading: { fontSize: 20, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 15 },
  price: { textAlign: "right", fontSize: 12, marginTop: 10 },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 10,
  },
});

const Invoice = ({ booking, vehicle, ownerName, renterName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Booking Invoice</Text>
        <Text style={{ ...styles.text, marginBottom: 5 }}>
          Booking Dates: {booking.startDate} - {booking.endDate}
        </Text>
        <View style={styles.line} />
        <Text style={styles.text}>Booking ID: {booking.id}</Text>
        <Text style={styles.text}>Vehicle Make: {vehicle.make}</Text>
        <Text style={styles.text}>Vehicle Model: {vehicle.model}</Text>
        <Text style={styles.text}>Vehicle Bought In: {vehicle.yearBought}</Text>
        <Text style={styles.text}>Vehicle Owner: {ownerName}</Text>
        <Text style={styles.text}>Vehicle Rented By: {renterName}</Text>
        <View style={styles.line} />
        <Text style={styles.price}>
          Booking Price: ${booking.finalPrice || vehicle.price}
        </Text>
      </View>
    </Page>
  </Document>
);

export default Invoice;
