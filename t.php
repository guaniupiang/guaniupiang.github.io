<?php
@extract($_POST);  //提取提交的参数
 
$filename = "log.txt";
                           
    $fp=fopen("$filename", "a+"); //如果文件存在 则打开文件并追加内容 否则创建
    if ( !is_writable($filename) ){
        die("文件:" .$filename. "不可写，请检查！");
    }else{
        $str = $name."\r\n".$email."\r\n".$textarea."\r\n\r\n";         //组合你想要记录的字符串  我就以你的表单为例~$name $textarea $email都是你表单内input元素的name属性 \r\n是换行
        fwrite($fp,$str);  //写入
         fclose($fp);    //关闭
    }
 
?>
