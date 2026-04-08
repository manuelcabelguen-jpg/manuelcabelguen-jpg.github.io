import os
from playwright.sync_api import sync_playwright

def verify_chronosuivi():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Construct file URL
        cwd = os.getcwd()
        file_url = f"file://{cwd}/chronosuivi/index.html"
        print(f"Navigating to {file_url}")

        page.goto(file_url)

        # Wait for React to mount
        page.wait_for_selector('h1:has-text("ChronoSuivi")', timeout=5000)

        # Check for StageBuilder
        stage_builder = page.locator('text=Configuration des Étapes')
        if stage_builder.is_visible():
            print("StageBuilder is visible")
        else:
            print("StageBuilder NOT visible")

        # Check for ConstraintManager
        # It defaults to closed or open? "defaultOpen={false}" in my code for ConstraintManager
        # So the title should be visible
        constraint_manager = page.locator('text=Jours Fériés & Contraintes')
        if constraint_manager.is_visible():
            print("ConstraintManager is visible")
            # Open it
            constraint_manager.click()
            page.wait_for_timeout(500) # Wait for animation
        else:
            print("ConstraintManager NOT visible")

        # Take screenshot
        os.makedirs("/home/jules/verification", exist_ok=True)
        page.screenshot(path="/home/jules/verification/chronosuivi_verify.png", full_page=True)
        print("Screenshot saved")

        browser.close()

if __name__ == "__main__":
    verify_chronosuivi()
