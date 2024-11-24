package com.wizzmie.server_app.Config;

import java.util.Base64;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.midtrans.Midtrans;

@Configuration
public class MidtransConfig {
    
    private final String serverKey = "SB-Mid-server-i1Zl0vN5onOKbk0CJ-EYr3bm";
    private static final String baseUrl = "https://api.sandbox.midtrans.com/v2/charge";
    private final String statusUrl = "https://api.sandbox.midtrans.com/v2/"; 
    private final boolean isProduction = false;

    private final String merchantId = "G950547607";


    @Bean
    public void configureMidtrans() {
        Midtrans.serverKey = serverKey;
        Midtrans.isProduction = isProduction;
    }

    public String getServerKey(){
        return serverKey;
    }

    public String getMerchantId(){
        return merchantId;
    }

    public boolean isProduction(){
        return isProduction;
    }

    public String getAuthorizationHeader(){
        String auth = serverKey + ":";
        return "Basic " + Base64.getEncoder().encodeToString(auth.getBytes());
    }

    public String getBaseUrl(){
        return baseUrl;
    }

    public String getStatusUrl(){
        return statusUrl;
    }
}
