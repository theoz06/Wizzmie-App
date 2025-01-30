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
import com.itextpdf.text.Rectangle;
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

        Document document = new Document(PageSize.A6);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);

        document.open();

        //Logo
        Image logo  = Image.getInstance(logoPath);
        logo.scaleToFit(100, 100);
        logo.setAlignment(Element.ALIGN_CENTER);
        document.add(logo);

        //Header
        Font headerFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
        Paragraph header = new Paragraph("WiZZMIE CIBADUYUT", headerFont);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);

        //Address
        Font normalFont = new Font(Font.FontFamily.TIMES_ROMAN, 8, Font.NORMAL);
        Paragraph address = new Paragraph("Jl. Terusan Cibaduyut No. 51", normalFont);
        address.setAlignment(Element.ALIGN_CENTER);
        document.add(address);

        //Separator
        document.add(new Paragraph("--------------------------------------------------------"));

        //Order Details
        document.add(new Paragraph("Order ID : " + order.getId(), normalFont));
        document.add(new Paragraph("Date     : " + order.getOrderDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:" )), normalFont));
        document.add(new Paragraph("Customer : " + order.getCustomer().getName(), normalFont));
        document.add(new Paragraph("Table    : " + order.getTableNumber(), normalFont));
        document.add(new Paragraph("Service  : Self Service", normalFont));
        document.add(new Paragraph("Purpose  : Dine In", normalFont));

        //Separator
        document.add(new Paragraph("--------------------------------------------------------"));

        NumberFormat nf = NumberFormat.getInstance(new Locale(logoPath));

        Integer totalItem = 0;
        for  (OrderItem item : order.getOrderItems()){
            totalItem += item.getQuantity(); 
            Paragraph itemParagraph = new Paragraph(item.getQuantity() + " " + item.getMenu().getName() + " " + nf.format(item.getMenu().getPrice()), normalFont);
            itemParagraph.setAlignment(Element.ALIGN_LEFT);
            document.add(itemParagraph);
        }

        Double subtotal = order.getTotalAmount() - (order.getTotalAmount() * (10/100));
        Double pbi = order.getTotalAmount() * (10.0/100);

        //Separator
        document.add(new Paragraph("--------------------------------------------------------"));
        document.add(new Paragraph(totalItem.toString(), normalFont));
        Paragraph subtotalParagraph = new Paragraph("Subtotal : " + nf.format(subtotal), normalFont);
        subtotalParagraph.setAlignment(Element.ALIGN_RIGHT);
        document.add(subtotalParagraph);
        Paragraph pbiParagraph = new Paragraph("PBI      : " + nf.format(pbi), normalFont);
        pbiParagraph.setAlignment(Element.ALIGN_RIGHT);
        document.add(pbiParagraph);

        //Separator
        document.add(new Paragraph("--------------------------------------------------------"));
        Font grandTotalFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
        Paragraph grandTotalParagraph = new Paragraph("Grand Total    : " + nf.format(order.getTotalAmount()), grandTotalFont);
        grandTotalParagraph.setAlignment(Element.ALIGN_RIGHT);
        document.add(grandTotalParagraph);
        Paragraph qrisParagraph = new Paragraph("QRIS           : " + nf.format(order.getTotalAmount()), normalFont);
        qrisParagraph.setAlignment(Element.ALIGN_RIGHT);
        document.add(qrisParagraph);


        //Separator
        document.add(new Paragraph("--------------------------------------------------------"));
        Paragraph freeDeliveryParagraph = new Paragraph("Free delivery Via WA : 081323459155", normalFont);
        freeDeliveryParagraph.setAlignment(Element.ALIGN_CENTER);
        document.add(freeDeliveryParagraph);

        Paragraph minMaxParagraph = new Paragraph("(min 100k, max 3 km)", normalFont);
        minMaxParagraph.setAlignment(Element.ALIGN_CENTER);
        document.add(minMaxParagraph);

        Paragraph customerServiceParagraph = new Paragraph("Customer Service : 08113069155 (Whatsapp)", normalFont);
        customerServiceParagraph.setAlignment(Element.ALIGN_CENTER);
        document.add(customerServiceParagraph);

        Paragraph thankYouParagraph = new Paragraph("- Thank you for your order -", normalFont);
        thankYouParagraph.setAlignment(Element.ALIGN_CENTER);
        document.add(thankYouParagraph);
       
        

        document.close();
        return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate receipt", e);
        }
        
    }
}
