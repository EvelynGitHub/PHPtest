FROM php:7.4-apache
RUN apt-get update && apt-get install -y curl libpq-dev && docker-php-ext-install mysqli pgsql pdo pdo_mysql pdo_pgsql
# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN a2enmod rewrite
