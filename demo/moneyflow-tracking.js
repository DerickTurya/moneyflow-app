/**
 * MoneyFlow Security Tracking SDK
 * Captura eventos de usuário para monitoramento de segurança
 */

(function() {
    'use strict';

    const API_URL = 'http://localhost:3000/api/v1';
    
    class MoneyFlowTracker {
        constructor() {
            this.sessionId = this.generateUUID();
            this.deviceId = this.getDeviceId();
            this.userId = null;
            this.accessToken = null;
            this.eventQueue = [];
            this.initialized = false;
            
            // Logs silenciosos para não atrapalhar
            setTimeout(() => {
                console.log('[MoneyFlow Tracking] 🎯 SDK ready');
            }, 100);
        }

        generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        getDeviceId() {
            let deviceId = localStorage.getItem('moneyflow_device_id');
            if (!deviceId) {
                deviceId = this.generateUUID();
                localStorage.setItem('moneyflow_device_id', deviceId);
            }
            return deviceId;
        }

        setUser(userId, accessToken) {
            // Executa de forma assíncrona para não bloquear
            setTimeout(() => {
                this.userId = userId;
                this.accessToken = accessToken;
                this.initialized = true;
                console.log('[MoneyFlow Tracking] ✅ User set:', userId);
            }, 0);
            
            // NÃO envia evento de login automaticamente
            // O login será trackeado manualmente no script.js
        }

        getDeviceInfo() {
            return {
                user_agent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screen: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
        }

        getLocationInfo() {
            // Em produção, isso viria de uma API de geolocalização
            return {
                country: 'BR',
                city: 'São Paulo',
                ip: 'Detectado automaticamente'
            };
        }

        track(eventType, properties = {}) {
            // Executa de forma completamente assíncrona (não bloqueia a aplicação)
            setTimeout(() => {
                this._sendTrackingEvent(eventType, properties);
            }, 0);
        }

        async _sendTrackingEvent(eventType, properties = {}) {
            // Se não autenticado, ainda trackeia mas usa ID de sessão como userId
            const userId = this.userId || `session_${this.sessionId}`;
            const token = this.accessToken || 'demo_token';

            const eventData = {
                user_id: userId,
                event_type: eventType,
                event_data: {
                    ...properties,
                    session_id: this.sessionId,
                    device_id: this.deviceId,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    referrer: document.referrer,
                    demo_mode: !this.initialized
                }
            };

            try {
                // Timeout de 3 segundos
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);
                
                console.log('[MoneyFlow Tracking] 📡 Enviando:', eventType, 'para user:', userId);
                
                const response = await fetch(`${API_URL}/analytics/events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(eventData),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                if (response.ok) {
                    const result = await response.json();
                    console.log('[MoneyFlow Tracking] ✅ Event sent:', eventType, '- ID:', result.data?.event_id);
                } else {
                    console.warn('[MoneyFlow Tracking] ⚠️ Response not OK:', response.status, eventType);
                }
            } catch (error) {
                console.error('[MoneyFlow Tracking] ❌ Failed to send:', eventType, error.message);
            }
        }

        async flushQueue() {
            if (this.eventQueue.length > 0 && this.initialized) {
                console.log('[MoneyFlow Tracking] 🔄 Flushing queue:', this.eventQueue.length, 'events');
                const events = [...this.eventQueue];
                this.eventQueue = [];
                
                for (const event of events) {
                    await this.track(event.eventType, event.properties);
                }
            }
        }

        // Rastreia navegação entre telas
        trackNavigation(screenName) {
            this.track('page_view', {
                page: screenName,
                previous_page: this.currentScreen || 'none'
            });
            this.currentScreen = screenName;
        }

        // Rastreia cliques em botões (aceita objeto ou parâmetros separados)
        trackClick(elementNameOrObject, elementType = 'button') {
            if (typeof elementNameOrObject === 'object') {
                // Chamada com objeto completo
                this.track('button_click', elementNameOrObject);
            } else {
                // Chamada com parâmetros separados (legado)
                this.track('button_click', {
                    button: elementNameOrObject,
                    type: elementType
                });
            }
        }

        // Rastreia transações financeiras (aceita objeto ou parâmetros separados)
        trackTransaction(typeOrObject, amount, details = {}) {
            if (typeof typeOrObject === 'object') {
                // Chamada com objeto completo
                this.track('transfer_completed', {
                    currency: 'BRL',
                    ...typeOrObject
                });
            } else {
                // Chamada com parâmetros separados (legado)
                this.track('transfer_completed', {
                    transaction_type: typeOrObject,
                    amount: amount,
                    currency: 'BRL',
                    ...details
                });
            }
        }

        // Rastreia alertas de segurança
        trackSecurityAlert(alertType, details = {}) {
            this.track('security_alert', {
                alert_type: alertType,
                severity: details.severity || 'medium',
                ...details
            });
        }
    }

    // Instância global
    window.MoneyFlowTracker = new MoneyFlowTracker();

    // Todos os interceptadores DESABILITADOS para evitar loops e flickering
    console.log('[MoneyFlow Tracking] 📝 Interceptadores desabilitados');
    console.log('[MoneyFlow Tracking] 📝 Auto-click desabilitado');
    console.log('[MoneyFlow Tracking] 📝 MutationObserver desabilitado');
    console.log('[MoneyFlow Tracking] 🚀 Manual tracking mode - use track(), trackClick(), trackTransaction() manualmente');
})();
