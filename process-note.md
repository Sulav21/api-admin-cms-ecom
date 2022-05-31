# user registration process

receive user data from frontend
server side validation 
if not valid (response with invalid message)
else (encrypt password)
store in the database
create unique url for email address validation and send that unique url to the client email

-Once client receives the email, they will follow the link that should redirect to our frontend page where
we will get the unique key part of the url and call server to verify that code 

Inserver:
receive the unique email validation code
check if the code is valid and exist in database
if not(respond invalid request message)
if exist (update user status from inactive to active in the database)
send email confirmation to the user saying the account is active 
respond successful request message to the client app


