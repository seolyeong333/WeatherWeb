package com.creepy.bit.controller.admin;

import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.service.admin.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public List<UserRequestDto> getAllUsers() {
        return adminUserService.getAllUsers();
    }
}
