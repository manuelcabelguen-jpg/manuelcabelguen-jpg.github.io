from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to app...")
            page.goto("http://localhost:5173", timeout=60000)

            # Wait for key elements
            print("Waiting for sidebar...")
            expect(page.get_by_text("Gestion de Cas")).to_be_visible(timeout=10000)

            print("Verifying sections...")
            expect(page.get_by_text("1. Identification & Statut")).to_be_visible()

            print("Verifying editor...")
            # Quill editor has class ql-editor
            editor = page.locator(".ql-editor")
            expect(editor).to_be_visible()

            print("Typing in editor...")
            editor.fill("Ceci est un test de rédaction correctionnelle avec React Quill.")

            print("Taking screenshot...")
            page.screenshot(path="verification/app_screenshot.png", full_page=True)
            print("Screenshot saved to verification/app_screenshot.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_screenshot.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
