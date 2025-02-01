package com.wizzmie.server_app.Controllers.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.wizzmie.server_app.Services.Implements.ReceiptServiceImpl;

@RestController
public class ReceiptControllerImpl {
    
    @Autowired
    private ReceiptServiceImpl receiptServiceImpl;

    @GetMapping("/api/receipt/{orderId}")
    public ResponseEntity<byte[]> getReceipt(@PathVariable Integer orderId){
        byte[] receipt = receiptServiceImpl.generateReceipt(orderId);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receipt-" + orderId + ".pdf");
        return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF).body(receipt);
    }
}
