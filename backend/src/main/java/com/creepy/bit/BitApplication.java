package com.creepy.bit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BitApplication {

	public static void main(String[] args) {
		SpringApplication.run(BitApplication.class, args);
	}

}
