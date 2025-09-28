# Real-time Database Connection Monitoring System

## Overview
Sistem monitoring koneksi database real-time untuk GMIT Imanuel Oepura yang terintegrasi dengan Supabase dan PostgreSQL menggunakan Prisma ORM. Sistem ini memberikan visibilitas lengkap terhadap kesehatan database, connection pool, performance metrics, dan statistik real-time.

## 🚀 Features

### Real-time Monitoring
- **Live Status Updates**: Update setiap 5 detik untuk metrics real-time
- **Connection Health**: Monitoring status Supabase dan Prisma connections
- **Active Connections**: Tracking koneksi aktif, idle, dan idle in transaction
- **Performance Metrics**: Query execution time dan response time monitoring
- **Database Size**: Real-time database size dan storage monitoring

### Database Connection Information
- **Supabase Integration**: Complete Supabase project monitoring
- **PostgreSQL Stats**: Direct PostgreSQL server statistics
- **Connection Pool**: Pool status dan configuration
- **SSL/Security**: Security configuration monitoring
- **Regional Info**: Database region dan endpoint information

### Advanced Metrics
- **Query Performance**: Simple, count, dan join query benchmarks
- **Table Statistics**: Insert, update, delete operations tracking
- **Uptime Monitoring**: Server uptime dan availability
- **Error Tracking**: Connection errors dan troubleshooting

## 📁 File Structure

```
src/
├── lib/
│   └── databaseMonitoring.js         # Core monitoring service
├── pages/api/admin/
│   ├── database-connections.js       # Main API endpoint (with auth)
│   └── database-connections-test.js  # Test endpoint (no auth)
├── components/system/
│   └── DatabaseConnectionMonitor.jsx # UI component
├── pages/admin/system-info/
│   └── index.js                     # Updated system info page
```

## 🔧 API Endpoints

### 1. Full Connection Monitoring
```
GET /api/admin/database-connections
Authorization: Bearer <token>
```

**Response Data:**
- Supabase connection status & configuration
- Prisma connection pool information
- PostgreSQL server statistics
- Performance benchmarks
- Real-time metrics

### 2. Real-time Metrics (Quick Updates)
```
GET /api/admin/database-connections?type=realtime
Authorization: Bearer <token>
```

**Response Data:**
- Quick health checks (5s updates)
- Current connection counts
- Performance snapshot
- Lightweight monitoring data

### 3. Test Endpoints (Development)
```
GET /api/admin/database-connections-test
GET /api/admin/database-connections-test?type=realtime
```

## 📊 Data Sources

### Supabase Monitoring
```javascript
// Health check via Supabase client
const { data, error } = await supabase.auth.getSession();

// Project information extraction
const projectId = supabaseUrl.split('//')[1].split('.')[0];
const region = extractRegionFromUrl(supabaseUrl);
```

### PostgreSQL Direct Queries
```sql
-- Database size
SELECT pg_size_pretty(pg_database_size(current_database())) as database_size;

-- Connection counts
SELECT
  count(*) as total_connections,
  count(*) FILTER (WHERE state = 'active') as active_connections,
  count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity
WHERE datname = current_database();

-- Server version and uptime
SELECT
  version() as postgresql_version,
  pg_postmaster_start_time() as server_start_time,
  EXTRACT(EPOCH FROM (now() - pg_postmaster_start_time())) as uptime_seconds;
```

### Prisma Performance Metrics
```javascript
// Query performance benchmarks
const simpleQuery = await measureQueryTime(() => prisma.user.findFirst());
const countQuery = await measureQueryTime(() => prisma.user.count());
const joinQuery = await measureQueryTime(() =>
  prisma.user.findFirst({ include: { jemaat: true } })
);
```

## 🎨 UI Components

### Real-time Status Cards
- **Supabase Health**: Status, response time, project info
- **Prisma ORM**: Connection status, query performance
- **Active Connections**: Current active/idle connections
- **Query Performance**: Average response times

### Detailed Information Panels
- **Supabase Details**: Project ID, region, features, SSL status
- **Prisma Configuration**: Database host, port, connection pool
- **PostgreSQL Stats**: Version, uptime, table statistics
- **Performance Metrics**: Query benchmarks dan trends

### Visual Indicators
- **Live Status Indicator**: Green pulsing dot untuk real-time updates
- **Status Icons**: Color-coded icons untuk different states
- **Progress Indicators**: Loading states dan error handling
- **Responsive Design**: Optimal di desktop dan mobile

## ⚡ Performance Features

### Optimized Refresh Intervals
- **Real-time Data**: 5 seconds untuk quick metrics
- **Full Connection Info**: 30 seconds untuk complete data
- **Database Stats**: 60 seconds untuk heavy queries
- **Manual Refresh**: Button untuk immediate updates

### Efficient Data Handling
- **BigInt Serialization**: Automatic handling untuk PostgreSQL bigint
- **Error Resilience**: Graceful handling untuk connection failures
- **Caching Strategy**: React Query untuk optimal performance
- **Background Updates**: Non-blocking refresh cycles

## 🔒 Security & Authentication

### Access Control
- **Admin Only**: Requires ADMIN role untuk access
- **JWT Authentication**: Secure token-based authentication
- **Connection String Masking**: Sensitive data protection
- **Error Message Sanitization**: No sensitive info dalam errors

### Safe Database Operations
- **Read-only Queries**: No destructive operations
- **Connection Pooling**: Efficient resource management
- **Timeout Handling**: Prevents hanging connections
- **Error Boundaries**: Prevents cascade failures

## 📈 Monitoring Capabilities

### Current Metrics Tracked
```
📊 Real-time Metrics:
├── Connection Status (Supabase + Prisma)
├── Active/Idle Connection Counts
├── Query Response Times
├── Database Size & Usage
├── PostgreSQL Server Uptime
├── Table Operation Counts (Insert/Update/Delete)
└── Error Rates & Health Status

🔍 Connection Details:
├── Supabase Project Configuration
├── PostgreSQL Version & Architecture
├── Connection Pool Status
├── SSL/Security Configuration
├── Regional & Network Information
└── Performance Benchmarks
```

### Sample Response Data
```json
{
  "success": true,
  "data": {
    "supabase": {
      "status": "connected",
      "projectId": "fyromtptrqdrcenzpbea",
      "region": "us-east-1",
      "features": {
        "realtime": true,
        "auth": true,
        "storage": true,
        "edgeFunctions": true
      }
    },
    "prisma": {
      "status": "connected",
      "responseTime": 107,
      "database": "postgres",
      "host": "aws-1-ap-southeast-1.pooler.supabase.com",
      "port": "6543",
      "ssl": true,
      "pooling": {
        "status": "active",
        "maxConnections": 10
      }
    },
    "serverStats": {
      "connections": {
        "total_connections": "25",
        "active_connections": "1",
        "idle_connections": "22"
      },
      "size": {
        "database_size": "12 MB"
      },
      "version": {
        "postgresql_version": "PostgreSQL 17.6",
        "uptime_seconds": "872821.988394"
      }
    },
    "performance": {
      "averageResponseTime": 111,
      "queries": {
        "simple": { "executionTime": 114, "status": "success" },
        "count": { "executionTime": 113, "status": "success" },
        "join": { "executionTime": 105, "status": "success" }
      }
    }
  }
}
```

## 🚀 Usage

### Accessing Real-time Monitoring
1. Login sebagai admin
2. Navigate ke "Informasi Sistem" di sidebar
3. Scroll ke section "Real-time Database Monitoring"
4. View live metrics dan detailed connection information

### Understanding the Metrics

#### Health Status Colors
- 🟢 **Green**: Healthy/Connected
- 🟡 **Yellow**: Warning/Degraded
- 🔴 **Red**: Error/Disconnected
- ⚫ **Gray**: Unknown/Loading

#### Connection States
- **Active**: Currently executing queries
- **Idle**: Connected but not active
- **Idle in Transaction**: Waiting for transaction completion

#### Performance Benchmarks
- **Simple Query**: Basic SELECT operation
- **Count Query**: Aggregation operation
- **Join Query**: Complex relational query

## 🔧 Configuration

### Environment Variables Required
```env
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Refresh Intervals (Customizable)
```javascript
// In system-info/index.js
const realTimeRefresh = 5000;    // 5 seconds
const connectionRefresh = 30000; // 30 seconds
const systemRefresh = 60000;     // 60 seconds
```

## 🛠️ Troubleshooting

### Common Issues

1. **BigInt Serialization Error**
   - ✅ Fixed: Automatic serialization dalam API responses

2. **Connection Timeout**
   - Check DATABASE_URL configuration
   - Verify Supabase project status
   - Check network connectivity

3. **Authentication Errors**
   - Ensure user has ADMIN role
   - Verify JWT token validity
   - Check authorization headers

4. **Performance Issues**
   - Monitor connection pool usage
   - Check query execution times
   - Review database load

## 🔄 Future Enhancements

### Planned Features
- [ ] Historical performance charts
- [ ] Alert thresholds dan notifications
- [ ] Connection pool optimization recommendations
- [ ] Query performance analysis
- [ ] Database health scoring
- [ ] Export functionality untuk monitoring data
- [ ] Integration dengan external monitoring tools

### Advanced Monitoring
- [ ] Slow query detection
- [ ] Connection leak detection
- [ ] Resource usage prediction
- [ ] Auto-scaling recommendations
- [ ] Performance regression detection

## 📞 Support

Untuk issue atau pertanyaan terkait real-time database monitoring:
1. Check logs di browser console
2. Verify endpoint responses via curl
3. Review server logs untuk database errors
4. Contact development team untuk advanced troubleshooting

## 🎯 Benefits

✅ **Real-time Visibility**: Instant insights into database health
✅ **Proactive Monitoring**: Early detection of performance issues
✅ **Connection Management**: Optimal resource utilization
✅ **Performance Optimization**: Data-driven optimization decisions
✅ **Troubleshooting Support**: Comprehensive diagnostic information
✅ **Security Monitoring**: Connection security dan access tracking