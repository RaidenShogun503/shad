// ========= ID MAPPING ========= //
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],  // Thay đổi ánh xạ ID tại đây
  'Locket': ['Gold'],                                // Thêm hoặc chỉnh sửa thông tin ID tại đây
  'PremiumUser': ['Platinum']                        // Ví dụ thêm ánh xạ mới cho một loại user khác
};

// =========   Phần cố định  ========= //
// =========  @Ohoang7 ========= //
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];  // Lấy User-Agent
var obj = JSON.parse($response.body);  // Chuyển đổi phản hồi từ JSON thành đối tượng

// Cập nhật thông báo cho người dùng

// Dữ liệu mua hàng mặc định cho người dùng
var ohoang7 = {
    is_sandbox: false,
    ownership_type: "PURCHASED",
    billing_issues_detected_at: null,
    period_type: "normal",
    expires_date: "2099-12-18T01:04:17Z",
    grace_period_expires_date: null,
    unsubscribe_detected_at: null,
    original_purchase_date: "2024-07-28T01:04:18Z",
    purchase_date: "2024-07-28T01:04:17Z",
    store: "app_store"
};

// Dữ liệu quyền truy cập cho người dùng
var vuong2023 = {
    grace_period_expires_date: null,
    purchase_date: "2024-07-28T01:04:17Z",
    product_identifier: "com.furiri.premium.yearly",
    expires_date: "2099-12-18T01:04:17Z"
};

// Tìm ánh xạ dựa trên User-Agent
const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
    let [entitlement_key, subscription_key] = mapping[match];  // Trả về cặp giá trị ánh xạ
    if (subscription_key) {
        vuong2023.product_identifier = subscription_key;  // Gán gói đăng ký
        obj.subscriber.subscriptions[subscription_key] = ohoang7;  // Cấp quyền đăng ký
    }
    obj.subscriber.entitlements[entitlement_key] = vuong2023;  // Cấp quyền sử dụng cho entitlements
} else {
    obj.subscriber.subscriptions["com.ohoang7.premium.yearly"] = ohoang7;  // Gán mặc định
    obj.subscriber.entitlements.pro = vuong2023;  // Gán quyền mặc định
}

// Hoàn tất và gửi phản hồi đã chỉnh sửa
$done({body: JSON.stringify(obj)});
