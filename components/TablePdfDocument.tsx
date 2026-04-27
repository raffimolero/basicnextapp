import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Shared styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pageNumber: {
    fontSize: 10,
  },
  filterInfo: {
    fontSize: 10,
    marginBottom: 15,
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    minHeight: 20,
    alignItems: "center",
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 2,
    marginBottom: 2,
  },
  tableCol: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  tableCellHeader: {
    fontWeight: "bold",
  },
  tableCell: {},
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    paddingTop: 5,
  },
});

// Generic column type
export interface Column<T> {
  key: string;
  label: string;
  render: (item: T, index: number) => React.ReactNode;
}

interface TablePdfDocumentProps<T> {
  title: string;
  data: T[];
  totalCount: number;
  columns: Column<T>[];
  searchQuery?: string;
}

function TablePdfDocument<T>({
  title,
  data,
  totalCount,
  columns,
  searchQuery,
}: TablePdfDocumentProps<T>) {
  const getColWidth = (key: string) => {
    if (key === "rowNumber") return "8%";
    const otherCols = columns.filter((c) => c.key !== "rowNumber").length;
    return `${92 / otherCols}%`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View fixed>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
          <Text style={styles.filterInfo}>
            Filtered by: {searchQuery || "None"}
          </Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeaderRow} fixed>
          {columns.map((col) => (
            <View
              key={col.key}
              style={{ ...styles.tableCol, width: getColWidth(col.key) }}
            >
              <Text
                style={[
                  styles.tableCellHeader,
                  col.key === "rowNumber"
                    ? { textAlign: "right", paddingRight: 8 }
                    : {},
                ]}
              >
                {col.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Rows */}
        <View style={styles.table}>
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              {columns.map((col) => (
                <View
                  key={`${index}-${col.key}`}
                  style={{ ...styles.tableCol, width: getColWidth(col.key) }}
                >
                  <Text
                    style={[
                      styles.tableCell,
                      col.key === "rowNumber"
                        ? { textAlign: "right", paddingRight: 8 }
                        : {},
                    ]}
                  >
                    {col.render(item, index)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
            {data.length} of {totalCount} {title}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default TablePdfDocument;