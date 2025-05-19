package com.creepy.bit.controller; 
// 배포 위해 만들었음

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {"/", "/{path:[^\\.]*}", "/{path:^(?!api|static|images|css|js).*$}/**/{path:[^\\.]*}"})
    public String forward() {
        // React 앱의 진입점인 index.html로 포워딩합니다.
        // 이 index.html은 src/main/resources/static/ 안에 있어야 합니다.
        return "forward:/index.html";
    }
}