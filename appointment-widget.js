class AppointmentWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.apiUrl = this.getAttribute("api-url") || "https://your-api.com/appointments";
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: Arial, sans-serif;
          display: block;
          border: 1px solid #ddd;
          padding: 16px;
          border-radius: 8px;
          max-width: 350px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          background: #fff;
        }
        h3 { margin: 0 0 10px; }
        label { font-weight: bold; display: block; margin-top: 10px; }
        input, select, textarea, button {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 14px;
        }
        textarea { resize: none; height: 60px; }
        button {
          background-color: #28a745;
          color: white;
          cursor: pointer;
          border: none;
          margin-top: 10px;
        }
        button:hover { background-color: #218838; }
        .message { margin-top: 10px; font-size: 14px; color: #d9534f; }
      </style>

      <h3>Book an Appointment</h3>
      <label for="name">Name</label>
      <input type="text" id="name" placeholder="Enter your name" required>

      <label for="email">Email</label>
      <input type="email" id="email" placeholder="Enter your email" required>

      <label for="phone">Phone</label>
      <input type="tel" id="phone" placeholder="Enter your phone" required>

      <label for="date">Date</label>
      <input type="date" id="date" required>

      <label for="time">Time</label>
      <select id="time"></select>

      <label for="message">Message</label>
      <textarea id="message" placeholder="Any additional information"></textarea>

      <button id="book">Book Appointment</button>
      <div class="message" id="messageBox"></div>
    `;

    this.setupTimeSlots();
    this.shadowRoot.querySelector("#book").addEventListener("click", () => this.bookAppointment());
  }

  setupTimeSlots() {
    const timeSlots = ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM", "5:00 PM"];
    const select = this.shadowRoot.querySelector("#time");
    select.innerHTML = timeSlots.map(slot => `<option value="${slot}">${slot}</option>`).join("");
  }

  async bookAppointment() {
    const name = this.shadowRoot.querySelector("#name").value.trim();
    const email = this.shadowRoot.querySelector("#email").value.trim();
    const phone = this.shadowRoot.querySelector("#phone").value.trim();
    const date = this.shadowRoot.querySelector("#date").value;
    const time = this.shadowRoot.querySelector("#time").value;
    const message = this.shadowRoot.querySelector("#message").value.trim();
    const messageBox = this.shadowRoot.querySelector("#messageBox");

    if (!name || !email || !phone || !date || !time) {
      messageBox.textContent = "All fields are required!";
      return;
    }

    const appointmentData = { name, email, phone, date, time, message };

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        messageBox.style.color = "green";
        messageBox.textContent = "Appointment booked successfully!";
        this.dispatchEvent(new CustomEvent("appointmentBooked", { detail: appointmentData, bubbles: true, composed: true }));
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      messageBox.textContent = "Error: " + error.message;
    }
  }
}

customElements.define("appointment-widget", AppointmentWidget);
