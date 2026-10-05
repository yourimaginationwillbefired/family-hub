from django.db import models


class SchoolEvent(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    source = models.CharField(max_length=120, blank=True, default="")
    notes = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return f"{self.title} ({self.date})"


class Package(models.Model):
    carrier = models.CharField(max_length=80)
    status = models.CharField(max_length=120)
    expected_date = models.DateField(null=True, blank=True)
    tracking_note = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        ordering = ["expected_date"]

    def __str__(self):
        return f"{self.carrier}: {self.status}"


class DigestItem(models.Model):
    category = models.CharField(max_length=80, unique=True)
    count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["category"]

    def __str__(self):
        return f"{self.category}: {self.count}"
