document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("btnAction");
  const params = new URLSearchParams(document.location.search);

  button.addEventListener("click", function () {
    changeStatus(params.get("id"), false);
  });

  // Función para cambiar el estado de un item
  function changeStatus(itemId, newStatus) {
    console.log("response");
    fetch(`/items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (response.ok) {
          console.log(response);
          window.location.replace("/static/gift-taken.html");
        } else {
          console.error(
            "Error al cambiar el estado del item:",
            response.statusText
          );
        }
      })
      .catch((error) =>
        console.error("Error al cambiar el estado del item:", error)
      );
  }
});
