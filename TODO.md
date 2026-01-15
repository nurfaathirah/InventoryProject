# TODO: Fix Admin Name Not Saving in Database When Stocking In

## Completed Tasks
- [x] Updated `api.js` to accept `adminId` and `adminName` parameters in `addStockEntries` function
- [x] Updated `storage.js` to retrieve current user from localStorage and pass `adminId` and `adminName` to the API call
- [x] Verified server-side code already handles `admin_id` and `admin_name` in the POST /api/stock route
- [x] Modified search functionality to filter stock table details based on search term (e.g., serial number shows only matching entry)

## Followup Steps
- [ ] Test the application by stocking in an item and verify that the admin name is saved in the database
- [ ] If issues persist, check browser console for errors and database logs
- [ ] Ensure user is logged in before attempting to stock in items
- [x] Test the updated search functionality to ensure tables display only relevant item details
