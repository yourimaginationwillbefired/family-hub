from rest_framework.routers import DefaultRouter

from .views import DigestItemViewSet, PackageViewSet, SchoolEventViewSet

router = DefaultRouter()
router.register(r"school-events", SchoolEventViewSet)
router.register(r"packages", PackageViewSet)
router.register(r"digest", DigestItemViewSet)

urlpatterns = router.urls
