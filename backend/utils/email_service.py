import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from datetime import datetime

# Configuration from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USERNAME)

def format_price(amount):
    return f"LKR {amount:,.2f}"

def send_booking_confirmation(
    contact_email: str,
    movie_title: str,
    cinema_name: str,
    screen_name: str,
    show_time_obj: datetime,
    seat_numbers: list,
    booking_id: int,
    total_amount: float
):
    """
    Send booking confirmation email with E-Ticket attached.
    """
    if not contact_email:
        print("No contact email provided for booking.")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = FROM_EMAIL
        msg['To'] = contact_email
        msg['Subject'] = f"Booking Confirmation - {movie_title}"

        # Booking Details
        formatted_booking_id = f"BK{booking_id}"
        seats_str = ", ".join(seat_numbers)
        time_str = show_time_obj.strftime("%I:%M %p")
        date_str = show_time_obj.strftime("%A, %B %d, %Y")
        
        # QR Code URL
        qr_data = formatted_booking_id
        qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={qr_data}"

        # HTML Body
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #e50914; text-align: center;">Booking Confirmed!</h2>
                <p>Hello,</p>
                <p>Thank you for booking with CineX. Your tickets are confirmed.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">{movie_title}</h3>
                    <p><strong>Cinema:</strong> {cinema_name} ({screen_name})</p>
                    <p><strong>Date:</strong> {date_str}</p>
                    <p><strong>Time:</strong> {time_str}</p>
                    <p><strong>Seats:</strong> {seats_str}</p>
                    <p><strong>Booking ID:</strong> {formatted_booking_id}</p>
                    <p><strong>Total Amount:</strong> {format_price(total_amount)}</p>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                    <img src="{qr_url}" alt="Booking QR Code" style="width: 150px; height: 150px;" />
                    <p style="font-size: 12px; color: #777;">Present this QR code at the cinema entrance.</p>
                </div>

                <p>Present the QR code above at the cinema entrance for admission.</p>
                <p>Enjoy the show!</p>
                <p style="font-size: 12px; color: #999;">The CineX Team</p>
            </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html_content, 'html'))

        # Send Email
        if not SMTP_USERNAME or not SMTP_PASSWORD:
            print("⚠️ SMTP credentials not set. Email simulation:")
            print(f"To: {contact_email}")
            print(f"Subject: Booking Confirmation - {movie_title}")
            return

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"✅ Email sent successfully to {contact_email}")

    except Exception as e:
        print(f"❌ Failed to send email: {e}")
