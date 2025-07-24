const ingredientContainer = document.getElementById("ingredient-fields");
const addButton = document.getElementById("add-ingredient");
const form = document.getElementById("ingredients-form");
const locationSelect = document.getElementById("location");
const recipeOutput = document.getElementById("recipe-output");
const recipeText = document.getElementById("recipe-text");
const newRecipeBtn = document.getElementById("new-recipe");
const copyBtn = document.getElementById("copy-recipe");

let maxIngredients = 10;

addButton.addEventListener("click", () => {
  const currentInputs = ingredientContainer.querySelectorAll("input").length;
  if (currentInputs < maxIngredients) {
    const input = document.createElement("input");
    input.type = "text";
    input.name = "ingredient";
    input.placeholder = `Ingrediente ${currentInputs + 1}`;
    input.required = true;
    ingredientContainer.appendChild(input);
  }
});

async function fetchRecipe(ingredients, location) {
  const response = await fetch("/.netlify/functions/chatgpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ingredients, location })
  });

  const data = await response.json();
  return data.message;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const ingredients = Array.from(
    document.querySelectorAll("input[name='ingredient']")
  ).map(input => input.value.trim()).filter(Boolean);

  const location = locationSelect.value;

  recipeText.textContent = "🍳 Sto preparando la ricetta...";
  recipeOutput.classList.remove("hidden");

  const recipe = await fetchRecipe(ingredients, location);
  recipeText.textContent = recipe;
});

newRecipeBtn.addEventListener("click", () => {
  form.dispatchEvent(new Event("submit"));
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(recipeText.textContent);
  alert("Ricetta copiata! 📋");
});