<?php
/**
 * SV PROPERTY & TOWNSHIP - HIGH PERFORMANCE LEAD PROCESSOR
 * Supports AJAX JSON & Standard POST with Email Dispatch & Lead Logging
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Sanitize and extract form inputs
    $name     = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
    $phone    = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : '';
    $email    = isset($_POST['email']) ? htmlspecialchars(trim($_POST['email'])) : 'Not Provided';
    $project  = isset($_POST['project']) ? htmlspecialchars(trim($_POST['project'])) : 'General Property Inquiry';
    $address  = isset($_POST['address']) ? htmlspecialchars(trim($_POST['address'])) : 'Not Provided';
    $message  = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : 'No custom message';
    
    // UTM & Tracking Parameters
    $utm_source   = isset($_POST['utm_source']) ? htmlspecialchars(trim($_POST['utm_source'])) : 'Direct/None';
    $utm_campaign = isset($_POST['utm_campaign']) ? htmlspecialchars(trim($_POST['utm_campaign'])) : 'None';
    $utm_medium   = isset($_POST['utm_medium']) ? htmlspecialchars(trim($_POST['utm_medium'])) : 'None';
    $fbclid       = isset($_POST['fbclid']) ? htmlspecialchars(trim($_POST['fbclid'])) : '';

    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

    if (empty($name) && empty($phone)) {
        if ($isAjax) {
            echo json_encode(['success' => false, 'message' => 'Please provide at least Name and Phone Number.']);
        } else {
            echo "<script>alert('Please provide Name and Phone Number'); window.history.back();</script>";
        }
        exit;
    }

    $timestamp = date("Y-m-d H:i:s");
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

    // Lead Logging to CSV / JSON for 100% Reliability
    $leadData = [
        'timestamp'    => $timestamp,
        'name'         => $name,
        'phone'        => $phone,
        'email'        => $email,
        'project'      => $project,
        'address'      => $address,
        'message'      => $message,
        'utm_source'   => $utm_source,
        'utm_campaign' => $utm_campaign,
        'utm_medium'   => $utm_medium,
        'fbclid'       => $fbclid,
        'ip'           => $ip
    ];

    $logFile = __DIR__ . '/leads_backup.csv';
    $isNewFile = !file_exists($logFile);
    if ($fp = @fopen($logFile, 'a')) {
        if ($isNewFile) {
            fputcsv($fp, ['Timestamp', 'Name', 'Phone', 'Email', 'Project', 'Address', 'Message', 'UTM Source', 'UTM Campaign', 'UTM Medium', 'FBCLID', 'IP']);
        }
        fputcsv($fp, [
            $timestamp, $name, $phone, $email, $project, $address, $message, $utm_source, $utm_campaign, $utm_medium, $fbclid, $ip
        ]);
        fclose($fp);
    }

    // Email Dispatch
    $to = "svproperty998@gmail.com, afshank998@gmail.com";
    $subject = "🔥 New Lead: " . $name . " (" . $project . ")";

    $body = "
==================================================
        NEW REAL ESTATE LEAD RECEIVED
==================================================
Full Name     : $name
Phone Number  : $phone
Email Address : $email
Project/Plot  : $project
Address       : $address
Client Message: $message

--- CAMPAIGN / META ADS TRACKING ---
Source        : $utm_source
Campaign      : $utm_campaign
Medium        : $utm_medium
FB Click ID   : $fbclid
Submitted At  : $timestamp
IP Address    : $ip
==================================================
    ";

    $headers = "From: SV Property Leads <noreply@svproperty.in>\r\n";
    $headers .= "Reply-To: $phone\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    @mail($to, $subject, $body, $headers);

    if ($isAjax) {
        echo json_encode([
            'success' => true,
            'message' => 'Your property visit inquiry has been received successfully!',
            'lead'    => ['name' => $name, 'project' => $project]
        ]);
    } else {
        echo "<script>
            window.location.href = 'thank-you.html?name=" . urlencode($name) . "&project=" . urlencode($project) . "';
        </script>";
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid Request Method']);
?>