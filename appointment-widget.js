class AppointmentWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.availableSlots = ["10:00 AM", "11:30 AM", "2:00 PM"]; // Default slots
      this.render();
    }
  
    static get observedAttributes() {
      return ["slots"]; // Allows slots to be set dynamically
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "slots") {
        this.availableSlots = newValue.split(",");
        this.render();
      }
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
            max-width: 300px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          }
          h3 { margin: 0 0 10px; }
          select, button {
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            border-radius: 4px;
            border: 1px solid #ccc;
          }
          button {
            background-color: #28a745;
            color: white;
            cursor: pointer;
          }
          button:hover {
            background-color: #218838;
          }
        </style>
  
        <h3>Book an Appointment</h3>
        <select id="slot"></select>
        <button id="book">Book Now</button>
      `;
  
      const select = this.shadowRoot.querySelector("#slot");
      select.innerHTML = this.availableSlots
        .map(slot => `<option value="${slot}">${slot}</option>`)
        .join("");
  
      this.shadowRoot.querySelector("#book").addEventListener("click", () => {
        const selectedSlot = select.value;
        alert(`Appointment booked for ${selectedSlot}!`);
        this.dispatchEvent(new CustomEvent("appointmentBooked", {
          detail: { slot: selectedSlot },
          bubbles: true,
          composed: true
        }));
      });
    }
  }
  
  customElements.define("appointment-widget", AppointmentWidget);
  
