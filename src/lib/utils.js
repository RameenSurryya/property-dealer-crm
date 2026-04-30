export function getLeadPriorityColor(score) {
  if (score === "High") return "bg-red-100 text-red-700 border-red-300";
  if (score === "Medium") return "bg-yellow-100 text-yellow-700 border-yellow-300";
  return "bg-green-100 text-green-700 border-green-300";
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function createWhatsAppLink(phone, message = "") {
  const cleanPhone = phone.replace(/\D/g, "");

  const encodedMessage = encodeURIComponent(
    message || "Hello, I am contacting you regarding your property inquiry."
  );

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function formatDate(date) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}