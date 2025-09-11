# Crypto Exchange Rate Application - DevOps Project

A cryptocurrency exchange rate dashboard built for heycar eCommerce to display real-time crypto prices for payment integration.

## 🚀 Quick Start

### Prerequisites
- Docker
- Node.js 18+ (for local development)
- Kubernetes cluster (minikube)
```bash
minikube start --driver=docker --nodes=2 --memory=5500 --cpus=3 --addons=ingress,metrics-server,registry
```
- Helm 3.0+

### Local Development Setup
1. **Clone the repository**
```bash
git clone https://github.com/razhel/crypto-exchange-app.git
cd crypto-exchange-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Access the local application**
```bash
kubectl port-forward svc/crypto-app 3000:80
```
   - Open http://localhost:3000 in your browser
   - API health check: http://localhost:3000/health
   - Metrics endpoint: http://localhost:3000/metrics

### Docker Development

1. **Build and run with Docker**
```bash
# Build the image
docker build -t crypto-exchange-app .

# Run the container
docker run -p 3000:3000 crypto-exchange-app
```

2. **Test the container**
```bash
curl http://localhost:3000/health 
```

## 🏗 Architecture

### Application Stack
- **Frontend**: JavaScript, HTML5, CSS3
- **Backend**: Node.js with Express.js framework
- **API Integration**: CoinGecko API for real-time cryptocurrency data
- **Monitoring**: Prometheus metrics with prom-client
- **Container**: Multi-stage Docker build with Alpine Linux

### Repository Structure
```
crypto-exchange-app/
├── .github/workflows/     # CI/CD pipeline (GitHub Actions)
├── helm/crypto-app/       # Kubernetes Helm charts
│   ├── templates/         # K8s resource templates
│   ├── Chart.yaml        # Helm chart metadata
│   └── values.yaml       # Configuration values
├── src/                   # Application source code
│   ├── routes/           # Express.js API routes
│   ├── services/         # Business logic services
│   ├── __tests__/        # Unit tests
│   └── app.js            # Main application entry
├── public/               # Static web assets
│   ├── index.html        # Frontend UI
│   ├── script.js         # Client-side JavaScript
│   └── styles.css        # Styling
├── Dockerfile            # Container build configuration
├── package.json          # Node.js dependencies
└── server.js             # Production server entry point
```

## 🚢 Deployment

### Kubernetes Deployment with Helm

1. **Prerequisites**
```bash
# Ensure kubectl is configured
kubectl cluster-info

# Install Helm (if not already installed)
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
```

2. **Deploy to Kubernetes**
```bash
# Install with default values
helm install crypto-app ./helm/crypto-app

# Install with custom values
helm install crypto-app ./helm/crypto-app \
  --set image.tag=v1.0.0 \
  --set replicaCount=3 \
  --set ingress.enabled=true
```

3. **Verify deployment**
```bash
# Check pod status
kubectl get pods -l app.kubernetes.io/name=crypto-app

# Check service
kubectl get svc crypto-app

# Check ingress (if enabled)
kubectl get ingress crypto-app
```

4. **Access the application**
```bash
# Port forward for local access
kubectl port-forward svc/crypto-app 3000:80

# Or use ingress URL (if configured)
# https://crypto-rates.local
```

### Production Configuration

For production deployment, customize the `values.yaml`:

```yaml
# Production values example
replicaCount: 2

image:
  repository: ghcr.io/razhel/crypto-exchange-app/crypto-exchange-app
  tag: "v1.0.0"

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: crypto-rates.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: crypto-app-tls
      hosts:
        - crypto-rates.yourdomain.com
```

## 📊 Monitoring Setup

### Prometheus & Grafana

1. **Install Prometheus Operator**
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus-operator prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set alertmanager.enabled=false \
  --set prometheusOperator.admissionWebhooks.enabled=false
```

2. **Deploy application with monitoring**
```bash
helm upgrade --install crypto-app ./helm/crypto-app \
  --set monitoring.enabled=true \
  --set monitoring.serviceMonitor.enabled=true
```

3. **Access Grafana dashboard**
```bash
# Get admin password
kubectl get secret prometheus-operator-grafana -o jsonpath="{.data.admin-password}" | base64 --decode

# Port forward to access Grafana
kubectl port-forward svc/prometheus-operator-grafana 3001:80 -n monitoring

# Access: http://localhost:3001
# Username: admin, Password: <from above command>
```

## 🔐 Security

### Container Security
- **Non-root user**: Application runs as UID 1001
- **Minimal base image**: Alpine Linux with essential packages only
- **Vulnerability scanning**: Trivy security scans in CI/CD

### Kubernetes Security
- **RBAC**: Role-based access control configured (for the appliaction)
- **Network policies**: Ingress/egress traffic restrictions
- **Pod security standards**: Security contexts enforced
- **Secrets management**: TLS certificates and API keys secured


### CI/CD & DevOps
- **Lint & security checks**: Ensures code quality and scans for vulnerabilities
- **Trivy security scan**: Scans Dockerfile and project directory for known issues
- **Build & push Docker image**: Builds and tags image with both latest and commit SHA, then pushes to GitHub Container Registry
- **Deploy to Minikube**: Uses Helm to deploy the application locally for testing

### Security Commands
```bash
# Scan container for vulnerabilities
trivy image ghcr.io/razhel/crypto-exchange-app/crypto-exchange-app:latest

# Check RBAC permissions
kubectl auth can-i --list --as=system:serviceaccount:default:crypto-app

# Verify network policies
kubectl get networkpolicy crypto-app
```

## 🧪 Testing

### Local Testing
```bash
# Run unit tests
npm test

# Run linting
npm run lint

# Security audit
npm audit
```

### Integration Testing
```bash
# Health check
curl -f https://crypto-rates.local/health
 
# Metrics endpoint
curl http://curl -f https://crypto-rates.local/metrics
```

### Load Testing (optional)
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3000/

# Using curl in loop
for i in {1..100}; do curl -s http://localhost:3000/health > /dev/null; done
```

## 🔧 Troubleshooting

### Common Issues

**Application not starting:**
```bash
# Check pod logs
kubectl logs -l app.kubernetes.io/name=crypto-app

# Check pod status
kubectl describe pod <pod-name>
```

**API not responding:**
```bash
# Test API endpoint directly
kubectl exec -it <pod-name> -- curl localhost:3000/health

# Check service connectivity  
kubectl run test-pod --rm -it --image=alpine/curl -- sh
# Then: curl http://crypto-app/health
```

**Monitoring not working:**
```bash
# Check ServiceMonitor
kubectl get servicemonitor crypto-app

# Check Prometheus targets
kubectl port-forward svc/prometheus-operated 9090:9090
# Access: http://localhost:9090/targets
```

### Performance Tuning

**Resource optimization:**
```bash
# Check current resource usage
kubectl top pods -l app.kubernetes.io/name=crypto-app

# Adjust resources in values.yaml and upgrade
helm upgrade crypto-app ./helm/crypto-app --values values.yaml
```

## 🚀 CI/CD Pipeline

The application includes a complete GitHub Actions pipeline:

### Pipeline Stages
1. **Lint & Security Checks**
   - ESLint code quality
   - YAML linting
   - Dependency vulnerability scan
   - Container security scan

2. **Build & Push**
   - Multi-platform Docker build
   - Push to GitHub Container Registry
   - Semantic versioning

3. **Deploy**
   - Helm chart deployment
   - Health check validation
   - Rollback via Helm or Git

### Triggering Deployment
```bash
# Push to main branch triggers full pipeline
git add .
git commit -m "add new feature"
git push origin main

# Check pipeline status
gh workflow list
gh run view <run-id>
```

## 🌍 Potential Production Deployment (AWS EKS)

### Prerequisites
- AWS CLI configured
- eksctl or Terraform
- kubectl configured for EKS

### Potential EKS Deployment Steps
```bash
# Create EKS cluster (using eksctl)
eksctl create cluster --name crypto-exchange --region us-east-1 --nodes 3

# Install AWS Load Balancer Controller
kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller//crds?ref=master"

# Deploy application
helm install crypto-app ./helm/crypto-app \
  --set ingress.className=alb \
  --set ingress.annotations."kubernetes\.io/ingress\.class"=alb

# Get Load Balancer URL
kubectl get ingress crypto-app
```

## 📝 Environment Variables

### Application Configuration
- `NODE_ENV`: Environment (development/production)
- `PORT`: Application port (default: 3000)
- `LOG_LEVEL`: Logging level (debug/info/warn/error)


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and add tests
4. Run linting and tests: `npm run lint && npm test`
5. Commit changes: `git commit -am 'Add new feature'`
6. Push to branch: `git push origin feature/new-feature`
7. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or issues:
- Create an issue in this repository
- Contact the DevOps team: noreply@heycar.com
- Documentation: [Project Wiki](https://github.com/razhel/crypto-exchange-app/wiki)

## 🏆 Achievements

✅ **Production Ready**: Scalable, secure, and monitored  
✅ **DevOps Excellence**: Full CI/CD automation with security scanning  
✅ **Conternarised**: Kubernetes-native with Helm charts  
✅ **Observability**: Comprehensive monitoring   
✅ **Security First**: Container and cluster security best practices  
✅ **High Availability**: Multi-replica deployment with auto-scaling  

---


