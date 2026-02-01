from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Construct file URL
            file_path = os.path.abspath("assistant-redaction-complete.html")
            print(f"Opening file://{file_path}...")
            page.goto(f"file://{file_path}", timeout=60000)

            # Wait for key elements to verify loading
            print("Waiting for app to load...")
            expect(page.get_by_text("Gestion de Cas")).to_be_visible(timeout=10000)

            print("Verifying sidebar content...")
            # Use a more specific locator to avoid strict mode violation
            expect(page.locator(".font-bold.text-sm").filter(has_text="DOE, John")).to_be_visible()

            print("Taking screenshot...")
            page.screenshot(path="verification/single_file_screenshot.png", full_page=True)
            print("Screenshot saved to verification/single_file_screenshot.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/single_file_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
