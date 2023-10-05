<?php
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data["projectName"])) {
        $projectName = $data["projectName"];
        // Save the project to a database or file (not implemented here)
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Project name not provided"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}
?>
