package com.wizzmie.server_app.Services.Implements;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.wizzmie.server_app.Entity.OrderItem;
import com.wizzmie.server_app.Entity.Orders;
import com.wizzmie.server_app.Repository.OrderRepository;

import org.springframework.beans.factory.annotation.Value;

@Service
public class ReceiptServiceImpl {
    
    @Autowired
    private OrderRepository orderRepository;

    @Value("${logo.path}")
    private String logoPath;

    public byte[] generateReceipt(Integer orderId) {
        try {
            Orders order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order Not Found"));

            float estimatedHeight = calculateRequiredHeight(order);
            Rectangle pageSize = new Rectangle(PageSize.A6.getWidth(), Math.max(PageSize.A6.getHeight(), estimatedHeight));
            Document document = new Document(pageSize);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            document.open();
            
            // Set smaller margins
            document.setMargins(20, 20, 20, 20);
            
            //Logo
            Image logo = Image.getInstance(logoPath);
            logo.scaleToFit(80, 80);
            logo.setAlignment(Element.ALIGN_CENTER);
            document.add(logo);
            
            //Header
            Font headerFont = new Font(Font.FontFamily.TIMES_ROMAN, 10, Font.BOLD);
            Paragraph header = new Paragraph("WiZZMIE CIBADUYUT", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            header.setSpacingAfter(2);
            document.add(header);
            
            //Address
            Font normalFont = new Font(Font.FontFamily.TIMES_ROMAN, 7, Font.NORMAL);
            Paragraph address = new Paragraph("Jl. Terusan Cibaduyut No. 51", normalFont);
            address.setAlignment(Element.ALIGN_CENTER);
            address.setSpacingAfter(2);
            document.add(address);
            
            //Separator with less spacing
            Paragraph separator = new Paragraph("------------------------------------------------------------------------------------------------", normalFont);
            separator.setSpacingBefore(2);
            separator.setSpacingAfter(2);
            document.add(separator);
            
            //Order Details
            document.add(new Paragraph("Order ID : " + order.getId() + "  Date: " + 
                order.getOrderDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), normalFont));
            document.add(new Paragraph("Customer : " + order.getCustomer().getName() + "  Table: " + 
                order.getTableNumber(), normalFont));
            document.add(new Paragraph("Service: Self Service  Purpose: Dine In", normalFont));
            
            document.add(separator);
            
            NumberFormat nf = NumberFormat.getInstance(new Locale(logoPath));
            
            // Order items with compact spacing
            Integer totalItem = 0;
            for (OrderItem item : order.getOrderItems()) {
                totalItem += item.getQuantity();
                Paragraph itemParagraph = new Paragraph(
                    item.getQuantity() + " " + item.getMenu().getName() + " " + 
                    nf.format(item.getMenu().getPrice()), normalFont);
                itemParagraph.setSpacingBefore(0);
                itemParagraph.setSpacingAfter(0);
                document.add(itemParagraph);
            }
            
            Double subtotal = order.getTotalAmount() - (order.getTotalAmount() * (10/100));
            Double pbi = order.getTotalAmount() * (10.0/100);
            
            document.add(separator);
            
            // Total section
            document.add(new Paragraph("Total Items: " + totalItem.toString(), normalFont));
            Paragraph subtotalParagraph = new Paragraph("Subtotal : " + nf.format(subtotal), normalFont);
            subtotalParagraph.setAlignment(Element.ALIGN_RIGHT);
            document.add(subtotalParagraph);
            Paragraph pbiParagraph = new Paragraph("PBI      : " + nf.format(pbi), normalFont);
            pbiParagraph.setAlignment(Element.ALIGN_RIGHT);
            document.add(pbiParagraph);
            
            document.add(separator);
            
            // Payment details
            Font grandTotalFont = new Font(Font.FontFamily.TIMES_ROMAN, 10, Font.BOLD);
            Paragraph grandTotalParagraph = new Paragraph("Grand Total : " + nf.format(order.getTotalAmount()), grandTotalFont);
            grandTotalParagraph.setAlignment(Element.ALIGN_RIGHT);
            document.add(grandTotalParagraph);
            Paragraph qrisParagraph = new Paragraph("QRIS        : " + nf.format(order.getTotalAmount()), normalFont);
            qrisParagraph.setAlignment(Element.ALIGN_RIGHT);
            document.add(qrisParagraph);
            
            document.add(separator);
            
            // Footer information
            PdfPTable footerTable = new PdfPTable(1);
            footerTable.setWidthPercentage(100);
            
            addFooterCell(footerTable, "Free delivery Via WA : 081323459155", normalFont);
            addFooterCell(footerTable, "(min 100k, max 3 km)", normalFont);
            addFooterCell(footerTable, "Customer Service : 08113069155 (Whatsapp)", normalFont);
            addFooterCell(footerTable, "- Thank you for your order -", normalFont);
            
            document.add(footerTable);
            
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate receipt", e);
        }
    }
    
    private void addFooterCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(1);
        table.addCell(cell);
    }

    private float calculateRequiredHeight(Orders order) {
        // Base height for fixed elements (logo, header, address, separators, footer)
        float baseHeight = 300; // Approximate height in points
        
        // Height per order item
        float itemHeight = 12; // Approximate height per item in points
        
        // Calculate total height needed for order items
        float itemsHeight = order.getOrderItems().size() * itemHeight;
        
        // Total estimated height needed
        return baseHeight + itemsHeight;
    }
    
}

