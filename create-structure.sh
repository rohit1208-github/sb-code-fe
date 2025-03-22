#!/usr/bin/env bash

# Create core Next.js "app" subfolders, including the (admin) route group
mkdir -p 'app/(admin)/dashboard'
mkdir -p 'app/(admin)/sb-management/countries/[id]'
mkdir -p 'app/(admin)/sb-management/branches/[id]'
mkdir -p 'app/(admin)/sb-management/roles'
mkdir -p 'app/(admin)/sb-management/staff/[id]'
mkdir -p 'app/(admin)/websites/base-template'
mkdir -p 'app/(admin)/websites/microsites-config'
mkdir -p 'app/(admin)/manage-components/menu'
mkdir -p 'app/(admin)/manage-components/testimonials'
mkdir -p 'app/(admin)/manage-components/language-switcher'
mkdir -p 'app/(admin)/manage-components/food-delivery-embed'
mkdir -p 'app/(admin)/manage-components/careers'
mkdir -p 'app/(admin)/optimization/whatsapp-links'
mkdir -p 'app/(admin)/optimization/seo/pagewise'
mkdir -p 'app/(admin)/optimization/seo/countrywise'

# Create a login page directory (placeholder for future auth)
mkdir -p 'app/login'

# Create additional folders for shared components, hooks, services, etc.
mkdir -p 'components/ui'
mkdir -p 'components/admin'
mkdir -p 'lib'
mkdir -p 'hooks'
mkdir -p 'services'
mkdir -p 'styles'

# Create a public/images folder (for any static assets you need)
mkdir -p 'public/images'

echo "Folder structure created successfully!"
