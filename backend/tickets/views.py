from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Ticket
from .serializers import TicketSerializer
from .services import classify_ticket

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        priority = self.request.query_params.get('priority')
        status_param = self.request.query_params.get('status')

        if category:
            queryset = queryset.filter(category=category)
        if priority:
            queryset = queryset.filter(priority=priority)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = Ticket.objects.values('status').annotate(count=Count('id'))
        category_stats = Ticket.objects.values('category').annotate(count=Count('id'))
        priority_stats = Ticket.objects.values('priority').annotate(count=Count('id'))
        
        return Response({
            "status_stats": stats,
            "category_stats": category_stats,
            "priority_stats": priority_stats,
            "total_tickets": Ticket.objects.count()
        })

    @action(detail=False, methods=['post'])
    def classify(self, request):
        description = request.data.get('description')
        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        classification = classify_ticket(description)
        return Response(classification)
