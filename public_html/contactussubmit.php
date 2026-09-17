<?php
/**
 * SV PROPERTY & TOWNSHIP - CONTACT FORM PROCESSOR
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $prefix   = isset($_POST['prefix']) ? htmlspecialchars(trim($_POST['prefix'])) : '';
    $name     = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
    $phone    = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : '';
    $email    = isset($_POST['email']) ? htmlspecialchars(trim($_POST['email'])) : 'Not Provided';
    $source   = isset($_POST['source']) ? htmlspecialchars(trim($_POST['source'])) : '';
    $interest = isset($_POST['interest']) ? htmlspecialchars(trim($_POST['interest'])) : 'General Inquiry';
    $message  = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

    if (empty($name) || empty($phone)) {
        if ($isAjax) {
            echo json_encode(['success' => false, 'message' => 'Please fill required fields (Name & Phone).']);
        } else {
            echo "<script>alert('Please fill required fields'); window.history.back();</script>";
        }
        exit;
    }

    $timestamp = date("Y-m-d H:i:s");
    $fullName = trim($prefix . ' ' . $name);

    // Save lead backup
    $logFile = __DIR__ . '/leads_backup.csv';
    $isNewFile = !file_exists($logFile);
    if ($fp = @fopen($logFile, 'a')) {
        if ($isNewFile) {
            fputcsv($fp, ['Timestamp', 'Name', 'Phone', 'Email', 'Project', 'Address', 'Message', 'UTM Source', 'UTM Campaign', 'UTM Medium', 'FBCLID', 'IP']);
        }
        fputcsv($fp, [
            $timestamp, $fullName, $phone, $email, $interest, 'Contact Page', $message, $source, '', '', '', $_SERVER['REMOTE_ADDR'] ?? ''
        ]);
        fclose($fp);
    }

    $to = "svproperty998@gmail.com, afshank998@gmail.com";
    $subject = "🔥 New Contact Inquiry: $fullName - $interest";

    $body = "
==================================================
        NEW CONTACT INQUIRY RECEIVED
==================================================
Name          : $fullName
Phone         : $phone
Email         : $email
Interested In : $interest
Discovery Ref : $source
Message       : $message
Timestamp     : $timestamp
==================================================
    ";

    $headers  = "From: SV Property <noreply@svproperty.in>\r\n";
    $headers .= "Reply-To: $phone\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    @mail($to, $subject, $body, $headers);

    if ($isAjax) {
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your inquiry has been submitted.',
            'lead'    => ['name' => $fullName, 'project' => $interest]
        ]);
    } else {
        echo "<script>
            window.location.href = 'thank-you.html?name=" . urlencode($fullName) . "&project=" . urlencode($interest) . "';
        </script>";
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid Request']);
?>