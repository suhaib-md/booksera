# Generated by Django 5.1.6 on 2025-03-21 12:14

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_alter_bookshelf_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='MediaRecommendation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('book_id', models.CharField(max_length=100)),
                ('book_title', models.CharField(max_length=255)),
                ('media_id', models.IntegerField()),
                ('media_title', models.CharField(max_length=255)),
                ('media_type', models.CharField(choices=[('movie', 'Movie'), ('tv', 'TV Show')], max_length=10)),
                ('poster_path', models.CharField(blank=True, max_length=255, null=True)),
                ('overview', models.TextField(blank=True, null=True)),
                ('relevance_score', models.FloatField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='media_recommendations', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'book_id', 'media_id')},
            },
        ),
    ]
