import os
from playwright.sync_api import sync_playwright

def verify_deletion():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the local HTML file
        file_path = os.path.abspath("assistant.html")
        page.goto(f"file://{file_path}")

        # Wait for React to mount and render sections
        # This confirms CDN scripts loaded and App mounted
        try:
            page.wait_for_selector("text=1. Identification", timeout=10000)
        except Exception as e:
            print("Failed to load application (CDNs might be blocked?):", e)
            page.screenshot(path="verification/load_failure.png")
            return

        print("Application loaded.")

        # Add a new section
        page.click("text=Ajouter Section")

        # Wait for "Nouvelle Section" to appear
        page.wait_for_selector("text=Nouvelle Section")
        print("Added new section.")

        # Take a screenshot before deletion
        if not os.path.exists("verification"):
            os.makedirs("verification")
        page.screenshot(path="verification/before_delete.png")

        # Handle dialog (confirm deletion)
        page.on("dialog", lambda dialog: dialog.accept())

        # Hover over "Nouvelle Section" container to show the trash icon
        # The text "Nouvelle Section" is in a span, the parent div is the container
        # Note: If there are multiple "Nouvelle Section", this might pick the first or fail.
        # Since we just added it, it should be at the bottom.
        # We can target the last element containing that text.

        # Using locator with has_text to find the specific item
        # The structure is: div > span(Nouvelle Section) ... div > button(trash)
        section_locator = page.locator("div.cursor-pointer", has_text="Nouvelle Section").last
        section_locator.hover()

        # Click the delete button inside that section
        # We search for the button inside the hovered section
        delete_btn = section_locator.locator("button[title='Supprimer']")

        # Ensure it's visible (hover logic in CSS)
        # Note: Playwright hover might trigger the CSS group-hover
        # But verify button is visible might be tricky if transition takes time.
        # Force click is an option, but let's try standard click.
        delete_btn.click()
        print("Clicked delete.")

        # Verify "Nouvelle Section" is gone
        # Wait for it to be hidden. If we had multiple, this checks if ALL are hidden?
        # No, wait_for_selector checks presence.
        # If we added one and deleted one, it should be gone (assuming no others).
        # But if the user ran the app before, local storage might have old data?
        # The script starts fresh browser context, but local storage persists?
        # Playwright context is fresh, so localStorage is empty.
        # The app init sets a default "1. Identification".
        # So "Nouvelle Section" should be unique.

        page.wait_for_selector("text=Nouvelle Section", state="hidden")
        print("Section deleted.")

        # Take a screenshot after deletion
        page.screenshot(path="verification/after_delete.png")

        browser.close()

if __name__ == "__main__":
    verify_deletion()
