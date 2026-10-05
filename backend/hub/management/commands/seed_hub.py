from datetime import date, timedelta

from django.core.management.base import BaseCommand

from hub.models import DigestItem, Package, SchoolEvent


class Command(BaseCommand):
    help = "Seed the hub with generic example data (inspired by common family email patterns)."

    def handle(self, *args, **options):
        today = date.today()

        events = [
            {
                "title": "Parent Info Session",
                "date": today + timedelta(days=3),
                "source": "School newsletter",
                "notes": "Evening session for parents — check school calendar for room details.",
            },
            {
                "title": "Pretzel Day",
                "date": today + timedelta(days=5),
                "source": "PTO email",
                "notes": "Snack fundraiser day. Bring exact change if ordering.",
            },
            {
                "title": "Fall Book Fair",
                "date": today + timedelta(days=12),
                "source": "School newsletter",
                "notes": "Runs all week in the library.",
            },
        ]
        for e in events:
            SchoolEvent.objects.update_or_create(
                title=e["title"], date=e["date"], defaults=e
            )

        packages = [
            {
                "carrier": "USPS",
                "status": "In transit",
                "expected_date": today + timedelta(days=2),
                "tracking_note": "Daily digest shows a package arriving soon.",
            },
            {
                "carrier": "Bookstore",
                "status": "Shipped",
                "expected_date": today + timedelta(days=4),
                "tracking_note": "Book order shipped — confirmation email received.",
            },
        ]
        for p in packages:
            Package.objects.update_or_create(
                carrier=p["carrier"],
                tracking_note=p["tracking_note"],
                defaults=p,
            )

        digest = [
            ("School", 6),
            ("Orders & shipping", 3),
            ("Newsletters", 12),
            ("Bills", 2),
        ]
        for category, count in digest:
            DigestItem.objects.update_or_create(
                category=category, defaults={"count": count}
            )

        self.stdout.write(self.style.SUCCESS("Seeded school events, packages, and digest items."))
