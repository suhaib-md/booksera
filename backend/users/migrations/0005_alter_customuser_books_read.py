# Generated by Django 5.1.6 on 2025-03-03 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_customuser_books_read_bookshelf'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='books_read',
            field=models.JSONField(default=list, help_text='List of books read'),
        ),
    ]
