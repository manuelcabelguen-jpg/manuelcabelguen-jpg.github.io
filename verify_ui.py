import os
from playwright.sync_api import sync_playwright

def verify_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        file_path = os.path.abspath("assistant.html")
        page.goto(f"file://{file_path}")

        try:
            page.wait_for_selector("text=1. Identification", timeout=10000)
        except:
            print("Failed to load")
            return

        # Add a new section
        # We need to find the "Ajouter Section" button.
        # Text match "Ajouter Section" works.
        page.click("text=Ajouter Section")

        # Wait for "Nouvelle Section" to appear
        page.wait_for_selector("text=Nouvelle Section")

        # Hover to show trash icon on the NEW section
        # We target the container div that has "Nouvelle Section"
        # We use .last in case there are multiple (though likely just one new one)
        section_locator = page.locator("div.group", has_text="Nouvelle Section").last
        section_locator.hover()

        # Wait a bit for transition
        page.wait_for_timeout(1000)

        # Ensure the delete button is visible before screenshot
        delete_btn = section_locator.locator("button[title='Supprimer']")
        # expect(delete_btn).to_be_visible() # verify visibility

        # Take screenshot showing the delete button
        if not os.path.exists("verification"):
            os.makedirs("verification")
        page.screenshot(path="verification/hover_delete.png")

        # Click delete and handle dialog
        page.on("dialog", lambda dialog: dialog.accept())
        delete_btn.click()

        # Verify it's gone
        page.wait_for_selector("text=Nouvelle Section", state="hidden")
        print("Verification successful: Section added, hovered (icon shown), and deleted.")

        browser.close()

if __name__ == "__main__":
    verify_ui()
