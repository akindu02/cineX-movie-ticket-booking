import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
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

                <p>An E-Ticket copy is attached to this email.</p>
                <p>Enjoy the show!</p>
                <p style="font-size: 12px; color: #999;">The CineX Team</p>
            </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html_content, 'html'))

        # Create E-Ticket HTML Attachment
        ticket_html = f"""
        <html>
        <head>
            <style>
                body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f0f2f5; padding: 40px; }}
                .ticket {{ 
                    background-color: white; 
                    width: 100%; 
                    max-width: 350px; 
                    margin: 0 auto; 
                    border-radius: 16px; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
                    overflow: hidden; 
                    position: relative;
                }}
                .header {{ 
                    background-color: #e50914; 
                    color: white; 
                    padding: 20px; 
                    text-align: center; 
                }}
                .content {{ padding: 20px; }}
                .movie-title {{ font-size: 20px; font-weight: bold; margin-bottom: 5px; }}
                .cinema-info {{ font-size: 14px; color: #666; margin-bottom: 20px; }}
                .detail-row {{ display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #eee; padding-bottom: 8px; }}
                .label {{ font-size: 12px; color: #888; text-transform: uppercase; font-weight: bold; }}
                .value {{ font-size: 14px; font-weight: bold; color: #333; }}
                .footer {{ text-align: center; padding: 20px; background-color: #f9f9f9; border-top: 1px solid #eee; }}
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="header">
                    <h2 style="margin:0;">CINEX TICKET</h2>
                    <p style="margin:5px 0 0 0; font-size: 12px; opacity: 0.9;">Admit One</p>
                </div>
                <div class="content">
                    <div class="movie-title">{movie_title}</div>
                    <div class="cinema-info">{cinema_name} • {screen_name}</div>
                    
                    <div class="detail-row">
                        <span class="label">Date</span>
                        <span class="value">{date_str}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Time</span>
                        <span class="value">{time_str}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Seats</span>
                        <span class="value" style="color: #e50914;">{seats_str}</span>
                    </div>
                     <div class="detail-row">
                        <span class="label">Booking ID</span>
                        <span class="value">{formatted_booking_id}</span>
                    </div>
                </div>
                <div class="footer">
                    <img src="{qr_url}" alt="QR Code" width="100" height="100" />
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">ID: {formatted_booking_id}</p>
                </div>
            </div>
        </body>
        </html>
        """

        attachment = MIMEApplication(ticket_html.encode('utf-8'), _subtype="html")
        attachment.add_header('Content-Disposition', 'attachment', filename=f"CineX_Ticket_{formatted_booking_id}.html")
        msg.attach(attachment)

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
